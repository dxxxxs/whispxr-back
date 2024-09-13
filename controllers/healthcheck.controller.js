exports.healthCheck = (req, res) => {
    return res.status(200).send({msg: 'All good'});
}