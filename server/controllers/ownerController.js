// import imagekit from "../configs/imagekit.js";
// import Booking from "../models/Booking.js";
// import Car from "../models/Car.js";
// import User from "../models/User.js";
// import fs from "fs";

// // =======================================================
// // Change role to Owner
// // =======================================================
// export const changeRoleToOwner = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     await User.findByIdAndUpdate(_id, { role: "owner" });
//     res.json({ success: true, message: "Now you can list cars" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // Add Car
// // =======================================================
// export const addCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     let car = JSON.parse(req.body.carData);
//     const imageFile = req.file;

//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/cars",
//     });

//     const optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "1280" },
//         { quality: "auto" },
//         { format: "webp" },
//       ],
//     });

//     const image = optimizedImageUrl;

//     await Car.create({ ...car, owner: _id, image });

//     res.json({ success: true, message: "Car Added" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // Get Owner Cars
// // =======================================================
// export const getOwnerCars = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const cars = await Car.find({ owner: _id });
//     res.json({ success: true, cars });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // Toggle Car Availability
// // =======================================================
// export const toggleCarAvailability = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;

//     const car = await Car.findById(carId);

//     if (!car) return res.json({ success: false, message: "Car not found" });

//     if (car.owner.toString() !== _id.toString()) {
//       return res.json({ success: false, message: "Unauthorized" });
//     }

//     car.isAvailable = !car.isAvailable;
//     await car.save();

//     res.json({ success: true, message: "Availability Toggled" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // Delete Car
// // =======================================================
// export const deleteCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { carId } = req.body;

//     const car = await Car.findById(carId);

//     if (!car) return res.json({ success: false, message: "Car not found" });

//     if (car.owner.toString() !== _id.toString()) {
//       return res.json({ success: false, message: "Unauthorized" });
//     }

//     car.owner = null;
//     car.isAvailable = false;

//     await car.save();

//     res.json({ success: true, message: "Car Removed" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // FIXED — Get Dashboard Data
// // =======================================================
// export const getDashboardData = async (req, res) => {
//   try {
//     const { _id, role } = req.user;

//     if (role !== "owner") {
//       return res.json({ success: false, message: "Unauthorized" });
//     }

//     const cars = await Car.find({ owner: _id });

//     // FIXED: use Mongoose sort()
//     const bookings = await Booking.find({ owner: _id })
//       .populate("car")
//       .sort({ createdAt: -1 });

//     const pendingBookings = await Booking.find({
//       owner: _id,
//       status: "pending",
//     });

//     const completedBookings = await Booking.find({
//       owner: _id,
//       status: "confirmed",
//     });

//     // FIXED: booking.status, not bookings.status
//     const monthlyRevenue = bookings
//       .filter((booking) => booking.status === "confirmed")
//       .reduce((acc, b) => acc + b.price, 0);

//     const dashboardData = {
//       totalCars: cars.length,
//       totalBookings: bookings.length,
//       pendingBookings: pendingBookings.length,
//       completedBookings: completedBookings.length,
//       recentBookings: bookings.slice(0, 3),
//       monthlyRevenue,
//     };

//     // FIXED: Return correct key (dashboardData)
//     res.json({ success: true, dashboardData });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// // =======================================================
// // Update User Image
// // =======================================================
// export const updateUserImage = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const imageFile = req.file;

//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/users",
//     });

//     const optimizedImageUrl = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "400" },
//         { quality: "auto" },
//         { format: "webp" },
//       ],
//     });

//     await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

//     res.json({ success: true, message: "Image Updated" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };



import imagekit from "../configs/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// =======================================================
// Change role to Owner
// =======================================================
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Add Car
// =======================================================
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({ ...car, owner: _id, image: optimizedImageUrl });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Get Owner Cars
// =======================================================
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });

    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Toggle Car Availability
// =======================================================
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Delete Car
// =======================================================
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// FIXED — Get Dashboard Data
// =======================================================
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedBookings = bookings.filter((b) => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce(
      (acc, booking) => acc + booking.price,
      0
    );

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Get Owner Bookings (Required for ManageBookings page)
// =======================================================
export const getOwnerBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// =======================================================
// Update User Image
// =======================================================
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
