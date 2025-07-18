import { Controller, Body, Post, UseGuards, Req, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'libs/common/guards';
import { Roles } from 'libs/common/decorators/roles.decorator';
import { UserRoles } from 'libs/common/enums';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand, UpdateProductCommand,DeleteProductCommand } from './commands';
import { GetProductQuery,GetProductsByCuratorIdQuery,getProductsByCategoryQuery } from './queries/index';
import { UpdateProductDto } from 'libs/common/dtos/dto.product';
import { CheckUserStripIdQuery } from '../user/queries';

@Controller('product')
export class ProductController {
    constructor(private commandBus: CommandBus,private queryBus: QueryBus) { }
    @Post('create')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRoles.User)
    async createProduct(@Body() dto, @Req() req) {
        try {
            const id = req.user.id;
            const curatorStripeId = await this.queryBus.execute(new CheckUserStripIdQuery(id));
            const { name, stock, pricingTiers, availablePlans, allowBackorder, maxSubscribers, description,category } = dto;
            const command = await this.commandBus.execute(new CreateProductCommand(
                id,
                curatorStripeId,
                name,
                stock,
                pricingTiers,
                availablePlans,
                allowBackorder,
                maxSubscribers,
                description,
                category
            ))
            if (!command) {
                return { message: "Product creation failed" };
            }
            return { message: "Product created successfully", product: command.product };
        } catch (error) {
            console.error('Error creating product:', error);
            return { message: "Failed to create product", error: error.message };
        }
    }
    @Get(':productId')
    @UseGuards(AuthGuard('jwt') )
    async getProduct(@Req() req) {
        const productId = req.params.productId;
        const userId = req.user.id;
        if (!userId) {
            return { message: "User ID is required." };
        }
        try {
            const product = await this.queryBus.execute(new GetProductQuery(productId));
            if (!product) {
                return { message: "Product not found." };
            }
            return { product };
        } catch (error) {
            console.error('Error fetching product:', error);
            return { message: "Failed to fetch product", error: error.message };
        }
    }
    @Post('update')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRoles.User)
    async updateProduct(@Body() dto: UpdateProductDto & { productId: string }, @Req() req) {
       const { productId, ...updateData } = dto;
        const userId = req.user.id;
        if (!productId || !userId) {
            return { message: "Product ID and User ID are required." };
        }
        try {
         const existingProduct = await this.queryBus.execute(new GetProductQuery(productId));
        if (!existingProduct) {
            throw new Error(`Product with ID ${productId} not found.`);
        }

            const command = await this.commandBus.execute(new UpdateProductCommand(
                productId,
                userId,
                existingProduct.curatorId, // Assuming curatorId is needed for validation
                updateData
            ));
            return command;
        } catch (error) {
            console.error('Error updating product:', error);
            return { message: "Failed to update product" };
        }
    }
    @Get('curator/:curatorId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async getProductsByCuratorId(@Req() req) {
        const curatorId = req.params.curatorId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (!curatorId) {
            return { message: "Curator ID is required." };
        }
        try {
            const products = await this.queryBus.execute(new GetProductsByCuratorIdQuery(curatorId, page, limit));
            return { products };
        } catch (error) {
            console.error('Error fetching products by curator ID:', error);
            return { message: "Failed to fetch products", error: error.message };
        }
    }
    @Get('category/:category')
    @UseGuards(AuthGuard('jwt'))
    async getProductsByCategory(@Req() req){
        const category = req.params.category;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (!category) {
            return { message: "Category is required." };
        }
        try {
            const products = await this.queryBus.execute(new getProductsByCategoryQuery(category, page, limit));
            return { products };
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return { message: "Failed to fetch products", error: error.message };
        }
    }
    @Post('delete/:productId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRoles.User)
    async deleteProduct(@Param('productId') productId: string, @Req() req) {
        const userId = req.user.id;
        if (!productId || !userId) {
            return { message: "Product ID and User ID are required." };
        }
        try {
            const existingProduct = await this.queryBus.execute(new GetProductQuery(productId));
            if (!existingProduct) {
                return { message: `Product with ID ${productId} not found.` };
            }
           
            await this.commandBus.execute(new DeleteProductCommand(productId, userId, existingProduct.curatorId)); // Assuming curatorId is same as userId for simplicity
            return { message: "Product deleted successfully" };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { message: "Failed to delete product", error: error.message };
        }
    }
}
