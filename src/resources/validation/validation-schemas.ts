import joi from 'joi'

export const productNameSchema = joi.string().regex(/^[a-zA-Z0-9,. ]*$/).min(2);

export const productsSchema = joi.object({
    name: productNameSchema.required(),
    description: joi.string().required(),
    price: joi.number().min(1).required(),
    image: joi.string().required(),
    limit: joi.number().integer().min(1)
});

export const productNamesArraySchema = joi.array().items(productNameSchema);