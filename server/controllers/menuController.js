const Menu = require("../model/Menu");
const fs = require("fs").promises;
const path = require("path");

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { title, content_text } = req.body;
    const image_url = req.file
      ? `${process.env.SERVER_URL}/upload/menu/${req.file.filename}`
      : null;

    const menu = await Menu.create({
      title,
      image_url,
      content_text: Array.isArray(content_text)
        ? content_text
        : JSON.parse(content_text || "[]"),
    });
    res.status(201).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { title, content_text } = req.body;
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    if (req.file && menu.image_url) {
      const oldPath = path.join(
        __dirname,
        "..",
        menu.image_url.replace(`${process.env.SERVER_URL}/`, "")
      );
      await fs.unlink(oldPath).catch(console.error);
    }

    menu.title = title || menu.title;
    menu.image_url = req.file
      ? `${process.env.SERVER_URL}/upload/menu/${req.file.filename}`
      : menu.image_url;
    menu.content_text = Array.isArray(content_text)
      ? content_text
      : JSON.parse(content_text || "[]");

    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    if (menu.image_url) {
      const filePath = path.join(
        __dirname,
        "..",
        menu.image_url.replace(`${process.env.SERVER_URL}/`, "")
      );
      await fs.unlink(filePath).catch(console.error);
    }

    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
