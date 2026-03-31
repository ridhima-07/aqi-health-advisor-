import { recommendationRules } from "./recommendationsRules.js";

export function generateRecommendations (ctx)
{
    let recommendations = [];

    for ( const rule of recommendationRules )
    {
        if ( rule.condition(ctx) )
        {
            recommendations.push({
                id: rule.id,
                category: rule.category,
                priority: rule.priority,
                message: rule.message(ctx)
            });
        }
    }

    recommendations.sort((a,b)=> b.priority - a.priority);

    return recommendations;
}