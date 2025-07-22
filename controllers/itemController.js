import Item from "../models/Item.js";


export const addItemToMasterList = async(req,res)=>{
    try {
        const {name,price} = req.body;
        if(!name || !price){
            return res
              .status(400)
              .json({ message: "Name and price are required" });
        }

        const existing = await Item.findOne({ name });
        if (existing) {
          return res
            .status(400)
            .json({ message: "Item already exists in master list" });
        }
        const item = await Item.create({ name, price, inMasterList: true });
        res.status(201).json(item);

    } catch (err) {
        res.status(500).json({ message: err.message });
        
    }
};

export const setItemOfTheDay = async(req,res)=>{
    try {
        const { itemId, quantity } = req.body;
        if (!itemId || quantity==null || quantity < 0) {
            return res.status(400).json({ message: "Invalid item ID or quantity" });
        }
        const item = await Item.findById(itemId);
        if (!item || !item.inMasterList) {
            return res.status(404).json({ message: "Item not found in master list" });
        }
        item.isTodayAvailable = true;
        item.quantity = quantity;
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });   
        
    }

}

export const getItemsOfTheDay = async (req, res) => {
  try {
    const items = await Item.find({
      isTodayAvailable: true,
      quantity: { $gt: 0 },
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMasterItemList = async (req, res) => {
  try {
    const items = await Item.find({ inMasterList: true });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/items/master/:itemId
export const updateMasterItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price, quantity } = req.body;

    const item = await Item.findById(itemId);

    if (!item || !item.inMasterList) {
      return res.status(404).json({ message: "Item not found in master list" });
    }

    if (item.isTodayAvailable) {
      return res.status(400).json({ message: "Cannot update item currently available today" });
    }

    if (name) item.name = name;
    if (price) item.price = price;
    if (quantity !== undefined && quantity !== null) item.quantity = quantity;

    await item.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/items/today/:itemId/quantity
export const updateTodayItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (quantity == null || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    const item = await Item.findById(itemId);
    if (!item || !item.isTodayAvailable) {
      return res.status(404).json({ message: "Item not found in today's items" });
    }
    item.quantity = quantity;
    await item.save();
    res.status(200).json({ message: "Today's item quantity updated", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/items/today/:itemId/unset
export const unsetTodayItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item || !item.isTodayAvailable) {
      return res.status(404).json({ message: "Item not found in today's items" });
    }
    item.isTodayAvailable = false;
    item.quantity = 0; // Optionally reset quantity
    await item.save();
    res.status(200).json({ message: "Item removed from today's items", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/items/:itemId
export const deleteMasterItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);

    if (!item || !item.inMasterList) {
      return res.status(404).json({ message: "Item not found in master list" });
    }

    if (item.isTodayAvailable) {
      return res.status(400).json({ message: "Cannot delete item currently available today" });
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
