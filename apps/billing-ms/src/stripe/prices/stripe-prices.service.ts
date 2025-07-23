import { Inject, Injectable } from "@nestjs/common";
import { STRIPE_SERVICE } from "../constant";
import Stripe from "stripe";

@Injectable()
export class StripePricesService{
    constructor(@Inject(STRIPE_SERVICE) private readonly stripeService:Stripe) {}
    async createPrices(data: Stripe.PriceCreateParams[],) {
        try {
            console.log('Creating prices with data:', data);
           
            
            let array = new Array()
            for (const priceData of data) {
                console.log('Creating price with data:', priceData);
                
                
                
                const price = await this.stripeService.prices.create(priceData);
                array.push(price)
                console.log('Price created successfully:', price);
            }
            console.log('Prices created successfully:');
            return {message:"Prices created successfully", success: true, prices: array};
        } catch (error) {
            console.error('Error creating Stripe prices:', error);
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to create your stripe prices", success: false, error: error.message};
            }
            // Handle non-Stripe errors
            return {message:"An error occurred while trying to create your stripe prices", success: false, error: error.message || 'Unknown error'};
        }
    }
    async getPrice(priceId: string) {
        try {
            console.log('Retrieving price with ID:', priceId);
            const price = await this.stripeService.prices.retrieve(priceId);
            console.log('Price retrieved successfully:', price);
            return {message:"Price retrieved successfully", success: true, price: price};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to retrieve your stripe price", success: false, error: error.message};
            }
        }
    }
    async updatePrice(priceId: string, data: Stripe.PriceUpdateParams) {
        try {
            console.log('Updating price with ID:', priceId, 'and data:', data);
            const price = await this.stripeService.prices.update(priceId, data);
            console.log('Price updated successfully:', price);
            return {message:"Price updated successfully", success: true, price: price};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to update your stripe price", success: false, error: error.message};
            }
        }
    }
    async deletePrice(priceId: string) {
        try {
            console.log('Deleting price with ID:', priceId);
            const deletedPrice = await this.stripeService.prices.update(priceId, { active: false });
            console.log('Price deleted successfully:', deletedPrice);
            return {message:"Price deleted successfully", success: true, price: deletedPrice};
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                console.error('Stripe error occurred:', error.message);
                return {message:"An error occurred while trying to delete your stripe price", success: false, error: error.message};
            }
        }
    }
        
}