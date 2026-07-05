import Product from "../models/Product.js";

// ---------------- CREATE PRODUCT ----------------
export const createProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((f) => f.path) : [];

    if (!images.length && req.body.images) {
      if (Array.isArray(req.body.images)) {
        images.push(...req.body.images);
      } else {
        images.push(req.body.images);
      }
    }

    if (!images.length) {
      return res.status(400).json({
        error: "At least one image is required",
      });
    }

    // User must choose a college before posting
    if (!req.user.college) {
      return res.status(400).json({
        error: "Please complete your profile and select your college.",
      });
    }

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      condition: req.body.condition,
      price: Number(req.body.price),
      negotiable: req.body.negotiable === "true",
      images,
      seller: req.user._id,

      // Always use the user's selected college
      college: req.user.college,
    });

    await product.populate(
      "seller",
      "name avatar rating totalSales isTrustedSeller"
    );

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// ---------------- GET PRODUCTS ----------------
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      negotiable,
      college,
      sort,
      status = "available",
    } = req.query;

    const q = { status };

    if (category && category !== "all") q.category = category;

    if (condition && condition !== "all") q.condition = condition;

    if (college) q.college = college;

    if (minPrice || maxPrice) {
      q.price = {};

      if (minPrice) q.price.$gte = Number(minPrice);

      if (maxPrice) q.price.$lte = Number(maxPrice);
    }

    if (negotiable !== undefined && negotiable !== "") {
      q.negotiable = negotiable === "true";
    }

    let query = Product.find(q);

    if (search) {
      query = query.find({
        $text: { $search: search },
      });
    }

    const sortMap = {
      recent: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      popular: { views: -1 },
    };

    query = query.sort(sortMap[sort] || sortMap.recent);

    const products = await query
      .populate(
        "seller",
        "name avatar rating totalSales isTrustedSeller"
      )
      .limit(60);

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ---------------- GET SINGLE PRODUCT ----------------
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    ).populate(
      "seller",
      "name avatar rating totalSales isTrustedSeller totalRatings bio college year"
    );

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ---------------- MY PRODUCTS ----------------
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ---------------- RESERVE ----------------
export const reserveProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (product.status !== "available") {
      return res.status(400).json({
        error: "Product not available",
      });
    }

    if (product.seller.equals(req.user._id)) {
      return res.status(400).json({
        error: "Cannot reserve your own product",
      });
    }

    product.status = "reserved";
    product.reservedBy = req.user._id;

    await product.save();

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ---------------- MARK SOLD ----------------
export const markAsSold = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (!product.seller.equals(req.user._id)) {
      return res.status(403).json({
        error: "Not your product",
      });
    }

    if (product.status !== "reserved") {
      return res.status(400).json({
        error: "Product is not reserved",
      });
    }

    product.status = "sold";
    product.soldTo = product.reservedBy;
    product.soldAt = new Date();

    await product.save();

    await req.user.constructor.findByIdAndUpdate(req.user._id, {
      $inc: {
        totalSales: 1,
      },
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ---------------- DELETE PRODUCT ----------------
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (!product.seller.equals(req.user._id)) {
      return res.status(403).json({
        error: "Not allowed",
      });
    }

    if (product.status === "sold") {
      return res.status(400).json({
        error: "Cannot delete a sold product",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    next(err);
  }
};