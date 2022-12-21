export const genericErrorHandler = (err, req, res, next) => {
  console.log("generic error", err);
  res
    .status(500)
    .send({ message: "An error occurred on our side :) we are working on it" });
};
