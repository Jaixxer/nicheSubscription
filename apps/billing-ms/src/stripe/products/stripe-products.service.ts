import { Injectable ,Inject} from "@nestjs/common";
import { STRIPE_SERVICE } from "../constant";
import Stripe from "stripe";

@Injectable()
export default class StripeProductService{
    constructor(@Inject(STRIPE_SERVICE) private readonly StripeService:Stripe){}
    async createProduct(data:Stripe.ProductCreateParams){
        try {
            console.log('Creating product with data:', data);
            const product = await this.StripeService.products.create({
                name: data.name,
                description: data.description || undefined,
                images: data.images || [],
                active: data.active || true,
            });
            console.log('Product created successfully:', product);
            return {message:"Product created successfully", success: true,product:product};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occured while trying to create your stripe product", success: false, error: error.message};
            }
        }

    }
    async getProduct(productId: string) {
        try {
            console.log('Retrieving product with ID:', productId);
            const product = await this.StripeService.products.retrieve(productId);
            console.log('Product retrieved successfully:', product);
            return {message:"Product retrieved successfully", success: true,product:product};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occured while trying to retrieve your stripe product", success: false, error: error.message};
            }
        }
    }
    async updateProduct(productId: string, data: Stripe.ProductUpdateParams) {
        try {
            console.log('Updating product with ID:', productId, 'and data:', data);
            const product = await this.StripeService.products.update(productId, data);
            console.log('Product updated successfully:', product);
            return {message:"Product updated successfully", success: true,product:product};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occured while trying to update your stripe product", success: false, error: error.message};
            }
        }

    }
    async deleteProduct(productId: string) {
        try {
            console.log('Deleting product with ID:', productId);
            const deletedProduct = await this.StripeService.products.del(productId);
            console.log('Product deleted successfully:', deletedProduct);
            return {message:"Product deleted successfully", success: true,product:deletedProduct};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occured while trying to delete your stripe product", success: false, error: error.message};
            }
        }
    }
}