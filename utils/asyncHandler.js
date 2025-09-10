// production based method for handler
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await Promise.resolve(func(req, res, next)).catch((err) => next(err))
    } catch (error) {
        res.status(error?.code || 500).json({ success: false, message: error?.message })
    }
}

export { asyncHandler }