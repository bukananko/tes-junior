import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./prisma.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

/**
 * Get all products that have status "bisa dijual"
 *
 * @route GET /api/produk
 * @returns {object[]} - Array of products that have status "bisa dijual".
 * @throws {Error} - If an error occurs while retrieving data.
 */
app.get("/api/produk", async (req, res) => {
  try {
    const produk = await prisma.produk.findMany({
      where: {
        status: {
          nama_status: "bisa dijual",
        },
      },
      include: {
        kategori: true,
        status: true,
      },
    });

    if (!produk) {
      return res.status(404).json({
        message: "Tidak ada produk yang bisa dijual",
      });
    }

    res.status(200).json(produk);
  } catch (error) {
    console.error(error);
  }
});

/**
 * Updating product based on id_produk.
 *
 * @route PATCH /api/produk/edit/:id_produk
 * @param {string} id_produk - The ID of the product you want to update.
 * @param {object} req.body - New product data.
 * @param {string} req.body.nama - New product name.
 * @param {number} req.body.harga - New product price.
 * @returns {object} - Updated product data.
 * @throws {Error} - If an error occurs while updating the product.
 */
app.patch("/api/produk/edit/:id_produk", async (req, res) => {
  try {
    const { id_produk } = req.params;
    const { nama, harga } = req.body;

    if (nama === "") {
      return res.status(400).json({
        message: "Nama produk harus di isi",
      });
    }

    if (harga <= 1000 || Number.isNaN(harga)) {
      return res.status(400).json({
        message: "Harga produk harus berupa angka dan minimal 1000",
      });
    }

    const produk = await prisma.produk.update({
      where: {
        id_produk,
      },
      data: {
        nama_produk: nama,
        harga,
      },
    });
    res.status(201).json(produk);
  } catch (error) {
    console.error(error);
  }
});

/**
 * Delete products based on id_produk.
 *
 * @route DELETE /api/produk/:id_produk
 * @param {string} id_produk - The ID of the product you want to delete.
 * @returns {object} - Deleted product data.
 * @throws {Error} - If an error occurs while deleting the product.
 */
app.delete("/api/produk/:id_produk", async (req, res) => {
  try {
    const { id_produk } = req.params;
    const produk = await prisma.produk.delete({
      where: {
        id_produk,
      },
    });
    res.status(200).json(produk);
  } catch (error) {
    console.error(error);
  }
});

/**
 * Create new product.
 *
 * @route POST /api/produk
 * @param {object} req.body - Data to create a new product.
 * @param {string} req.body.nama - Product name.
 * @param {number} req.body.harga - Product price.
 * @param {string} req.body.status - Product status.
 * @param {string} req.body.kategori - Product category.
 * @returns {object} - Product that have been made.
 * @throws {Error} - If an error occurs while creating the product.
 */
app.post("/api/produk", async (req, res) => {
  try {
    const { nama, harga, status, kategori } = req.body;

    if (nama === "") {
      return res.status(400).json({
        message: "Nama produk harus di isi",
      });
    }

    if (harga <= 1000 || Number.isNaN(harga)) {
      return res.status(400).json({
        message: "Harga produk harus berupa angka dan minimal 1000",
      });
    }

    const getCategoryId = await prisma.kategori.findFirst({
      where: {
        nama_kategori: kategori,
      },
    });

    if (!getCategoryId) {
      return res.status(400).json({
        message: "Kategori produk tidak ditemukan",
      });
    }

    const getStatusId = await prisma.status.findFirst({
      where: {
        nama_status: status,
      },
    });

    if (!getStatusId) {
      return res.status(400).json({
        message: "Status produk tidak ditemukan",
      });
    }

    const produk = await prisma.produk.create({
      data: {
        nama_produk: nama,
        harga,
        kategori_id: getCategoryId.id_kategori,
        status_id: getStatusId.id_status,
      },
    });
    res.status(201).json(produk);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
