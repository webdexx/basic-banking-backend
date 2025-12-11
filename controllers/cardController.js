const Card = require("../models/Card");
const Account = require("../models/Account");

const createCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const accountInfo = await Account.findOne({ user: userId });
    const { limit, cardType, dependency } = req.body;

    const range = 10000;
    const uniqueCard = `4876778005155${Math.floor(Math.random() * range)}`;
    const cvv = Math.floor(Math.random() * 1000);

    if(cardType === "Prepaid") {
      limit = 0;
    } 

    const existingCard = await Card.findOne({ user: userId });

    const createNewCard = await Card.create({
      cardNumber: `${uniqueCard}`,
      securityCode: cvv,
      limit: limit,
      cardType: cardType,
      expiryMonth: 11,
      expiryYear: 28,
      status: "ACTIVE",
      dependency,
      user: userId,
      account: accountInfo._id
    });

    return res.status(201).json({
      message: "Card Generated Successfully",
      createNewCard,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const showCard = async (req, res) => {
  try {
    const userId = req.user.id;

    const cardDetails = await Card.findOne({ user: userId });

    return res.status(200).json({
      message: "Fetch Successful",
      cardDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createCard, showCard };
