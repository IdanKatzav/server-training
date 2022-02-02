import joi from 'joi'

export const productNameSchema = joi.string().alphanum().min(2);

export const productsSchema = joi.object({
    name: productNameSchema.required(),
    description: joi.string().alphanum().required(),
    price: joi.number().min(1).required(),
    image: joi.string().alphanum().required(),
    limit: joi.number().integer().min(1)
});

export const productNamesArraySchema = joi.array().items(productNameSchema);