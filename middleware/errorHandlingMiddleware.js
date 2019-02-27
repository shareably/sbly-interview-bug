module.exports = (err, req, res, next) => {  
  const path = req.path;

  var headers;
  var params;
  var body;
  var jsonError;

  if (err.response) {
    console.log(err.response.data);
  } else {
    console.log(err)
  }

  if (err.status === 400) {
    res.status(400).json(err);
  } else if (err.status === 403) {
    res.status(403).json({'error': 'Insufficient permissions to access resource'});
  } else if (err.status === 401) {
    res.status(401).json({'error': 'Request is not property authenticated', 'status': 401});
  } else if (err.status === 404) {
    res.status(404).json(err);
  } else {
    res.status(500).json({'error': 'An Internal Server Error has Occurred.', 'description': `${err}`});
  }
};
