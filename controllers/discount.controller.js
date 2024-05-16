const Discount = require("../models/discount.model");

module.exports = {


 getAllDiscounts : async (req, res) => {
    const perPage = 5; // Số lượng bài viết xuất hiện trên 1 trang
    const page = req.query.page || 1; // Số trang hiện tại
  try {
    const totalDiscount = await Discount.countDocuments();
    const discounts = await Discount.find();
    const totalPages = Math.ceil(totalDiscount / perPage);
  
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          page: i,
          isCurrentPage: i === +page,
        });
      }
  
      res.render("discount/list-discount", {
        discounts,
        pages,
        isNextPage: page < totalPages,
        isPreviousPage: page > 1,
        nextPage: +page + 1,
        previousPage: +page - 1,
      });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch discounts", error });
  }
},
// GET /discounts/:id
 getDiscountById : async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch discount", error });
  }
},
// Get add discount
addDiscountGet: async (req, res) => {
  try {
    const discounts = await Discount.find({});
    res.render("discount/add-discount", { discounts });
    console.log(req.body)
    
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch discounts", error });
  }

},
// POST /discounts
 createDiscount : async (req, res) => {
  const { title, dayStart, dayEnd, codeDiscount, discount, description } = req.body;
    console.log(title, dayEnd, dayStart)
    console.log(req.body)
  try {
    const newDiscount = new Discount({
      title : title,
      dayStart : dayStart,
      dayEnd : dayEnd,
      codeDiscount : codeDiscount,
      discount : discount,
      description : description,
    });
    await newDiscount.save();
    const discounts = await Discount.find({});
    console.log("new", newDiscount)
    console.log(discounts)
    console.log(JSON.stringify(newDiscount))
    res.redirect("/discount");


    // res.status(201).json({ message: "Discount created successfully", newDiscount });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
},
// PUT /discounts/:id
 updateDiscount : async (req, res) => {
  const { id } = req.params;
  const { title, dayStart, dayEnd, codeDiscount, discount, description } =
    req.body;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    discount.title = title;
    discount.dayStart = dayStart;
    discount.dayEnd = dayEnd;
    discount.codeDiscount = codeDiscount;
    discount.discount = discount;
    discount.description = description;
    await discount.save();
    res.status(200).json({ message: "Discount updated successfully", discount });
  } catch (error) {
    res.status(500).json({ message: "Unable to update discount", error });
  }
},
// DELETE /discounts/:id
 deleteDiscount : async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await Discount.findById(id);
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    await discount.remove();
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete discount", error });
  }
}
}

