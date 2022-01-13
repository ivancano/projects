let handleError = (err, res, statusCode) => {
    res.status(statusCode || 500).json({
        'message': err.name || err.message || 'error',
        statusCode: statusCode || 500,
        error: err
    });
};

let handleSuccess = (data, res, statusCode) => {
    res.status(statusCode || 200).json({
        message: 'success',
        statusCode: 200,
        data: data
    });
};

module.exports = {
    handleError,
    handleSuccess
}