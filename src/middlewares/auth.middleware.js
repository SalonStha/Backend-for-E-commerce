const authValidator = (schema) => {
    return async (req, res, next) => {
        try {
            const data = req.body;
            await schema.validateAsync(data, { abortEarly: false })
            next()

        } catch (exception) {
            let messageBag = {}  //400 with a message bag //422 without a message bag

            exception.details.map((error) => {
                let key = error.path.pop()
                messageBag[key] = error.message
                console.log(error)
            });
            next({
                code: 400,
                detail: messageBag,
                message: 'Validation Error',
                status: 'Bad Request',
            });
        }
    };
};

module.exports = authValidator



