import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api-gateway/prisma/prisma.service';
import { ProductDto, UpdateProductDto } from '../../../../../libs/common/dtos/dto.product';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class ProductRepository {
    constructor(private prismaService: PrismaService) { }
    async createProduct(id, dto: ProductDto) {
        try {
            const { name, stock, pricingTiers, availablePlans, allowBackorder, maxSubscribers, description, category } = dto;
            const productCreation = await this.prismaService.product.create({
                data: {
                    name,
                    stock,
                    allowBackorder,
                    maxSubscribers,
                    description,
                    availablePlans: {
                        set: availablePlans
                    },
                    category,
                    pricingTiers: {
                        create: pricingTiers.map(tier => ({
                            plan: tier.plan,
                            minQuantity: tier.minQuantity,
                            pricePerUnit: tier.pricePerUnit,
                            maxQuantity: tier.maxQuantity,
                            isActive: tier.isActive ?? true
                        }))
                    },
                    curatorId: id
                },
                include: {
                    pricingTiers: true
                }
            });
            return { message: "Product created successfully", product: productCreation };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error('Product with this name already exists');
                }
                console.error('Error creating product:', error);
                throw new Error('Failed to create product');
            }
        }
    }
    async findById(productId: string) {
        try {
            const product = await this.prismaService.product.findUnique({
                where: { id: productId },
                select: {
                    id: true,
                    curatorId: true,
                    name: true,
                    stock: true,
                    allowBackorder: true,
                    maxSubscribers: true,
                    description: true || undefined, // Convert null to undefined
                    category: true,
                    availablePlans: true,
                    pricingTiers: {
                        select: {
                            plan: true,
                            minQuantity: true,
                            maxQuantity: true,
                            pricePerUnit: true,
                            isActive: true
                        }
                    }
                }
            });
            // if (!product) {
            //     return "Product not found";
            //     throw new Error(`Product with ID ${productId} not found`);
            // }
            return product;
        } catch (error) {
            console.error(`Error fetching product with ID ${productId}:`, error);
            throw new Error(`Failed to fetch product: ${error.message}`);
        }
    }
    async updateProductDetails(productId: string, curatorId, dto: UpdateProductDto) {
        try {
            const { name, stock, availablePlans, allowBackorder, maxSubscribers, description, category } = dto;
            if (!productId || !curatorId) {
                throw new Error("Product ID and Curator ID are required.");
            }
            const productUpdate = await this.prismaService.product.update({
                where: { id: productId },
                data: {
                    ...(dto.name && { name: dto.name }),
                    ...(dto.stock !== undefined && { stock: dto.stock }),
                    ...(dto.allowBackorder !== undefined && { allowBackorder: dto.allowBackorder }),
                    ...(dto.maxSubscribers !== undefined && { maxSubscribers: dto.maxSubscribers }),
                    ...(dto.description && { description: dto.description }),
                    ...(dto.category && { category: dto.category }),
                    ...(dto.availablePlans && {
                        availablePlans: {
                            set: dto.availablePlans
                        }
                    })
                },
                select: {
                    id: true,
                    name: true,
                    stock: true,
                    allowBackorder: true,
                    maxSubscribers: true,
                    description: true || undefined, // Convert null to undefined
                    category: true,
                    availablePlans: true,
                    pricingTiers: {
                        select: {
                            plan: true,
                            minQuantity: true,
                            maxQuantity: true,
                            pricePerUnit: true,
                            isActive: true
                        }
                    }
                }
            });
            if (!productUpdate) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            return { message: "Product updated successfully", product: productUpdate };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2012') {
                    throw new Error('Invalid value provided for one or more fields');
                }
                if (error.code === 'P2019') {
                    throw new Error('Invalid input data provided');
                }
                if (error.code === 'P2025') {
                    throw new Error(`Product with ID ${productId} not found`);
                }
            }
            console.error('Error updating product:', error);
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }
    async findProductsByCuratorId(curatorId: string, limit: number, offset: number) {
        try {
            const result = await this.prismaService.product.findMany({
                where: { curatorId },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    name: true,
                    stock: true,
                    allowBackorder: true,
                    maxSubscribers: true,
                    description: true || undefined, // Convert null to undefined
                    category: true,
                    availablePlans: true,
                    pricingTiers: {
                        select: {
                            plan: true,
                            minQuantity: true,
                            maxQuantity: true,
                            pricePerUnit: true,
                            isActive: true
                        }
                    }
                }
            });
            return result

        } catch (error) {
            
        }

    }
    async findProductsByCategory(category:string,limit:number,offset:number){
        try {
            const products = await this.prismaService.product.findMany({
                where:{
                    category:category
                },
                take: limit,
                skip: offset,
                select:{
                    id: true,
                    name: true,
                    stock: true,
                    allowBackorder: true,
                    maxSubscribers: true,
                    description: true || undefined, // Convert null to undefined
                    category: true,
                    availablePlans: true,
                    pricingTiers: {
                        select: {
                            plan: true,
                            minQuantity: true,
                            maxQuantity: true,
                            pricePerUnit: true,
                            isActive: true
                        }
                    }
                }

            })
            return products
        } catch (error) {
            throw new Error(`Failed to fetch products by category: ${error.message}`);
        }
    }
    async deleteProduct(productId: string) {
        try {
            const product= await this.prismaService.product.delete({
                where: { id: productId },
                });
                return product
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error(`Product with ID ${productId} not found`);
                }
            }
            throw new Error(`Failed to delete product: ${error.message}`);
        }
}}
