import express from 'express';
import cors from 'cors';
import { getPickingListByDate } from './services/pickingService';
import { getOrderListByDate } from './services/packingService';

const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();
app.use("/", router);

router.get('/picking-list', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) res.status(400).json({ error: "Please provide a date" });

        const pickingList = await getPickingListByDate(date as string);
        res.json({ products: pickingList });
    } catch(error) {
        res.status(500).json({ error: error})
    }
})

router.get('/packing-list', async (req, res) => {
    console.log("reached here")
    try {
        const { date } = req.query;
        if (!date) res.status(400).json({ error: "Please provide a date" });
        
        const orderList = await getOrderListByDate(date as string);
        console.log(orderList);
        res.json({ orders: orderList});
    } catch(error) {
        res.status(500).json({ error: error});
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend is ready to serve on port ${PORT}!`));
