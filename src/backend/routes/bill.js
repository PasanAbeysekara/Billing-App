const express = require("express");
const router = express.Router();
const Bill = require("../models/BillModel");

router.post("/", (req, res) => {
  const { totalAmount, advancePayment, remainingPayment, jobs } = req.body;

  Bill.createBill(
    totalAmount,
    advancePayment,
    remainingPayment,
    (err, bill) => {
      if (err) return res.status(500).send(err);

      jobs.forEach((job) => {
        Bill.createJob(
          bill.id,
          job.department,
          job.dsrId,
          job.amount,
          (err, job) => {
            if (err) return res.status(500).send(err);
          }
        );
      });

      res.status(200).send({ billId: bill.id });
    }
  );
});

module.exports = router;
