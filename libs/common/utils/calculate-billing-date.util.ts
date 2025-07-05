import { RenewalPlan } from "../dtos/dto.product";

export function calculateNextBillingDate(plan:RenewalPlan,previousBillingDate:Date){
    const date = new Date(previousBillingDate)
    switch(plan){
        case RenewalPlan.biWeekly :
            date.setDate(date.getDate()+7)
            break
        case RenewalPlan.weekly:
            date.setDate(date.getDate()+7)
            break
        case RenewalPlan.monthly:
            date.setMonth(date.getMonth()+1)
            break
        default:
            throw new Error("Unknown Renewal Plan!")
            break
    }
    return date;

}