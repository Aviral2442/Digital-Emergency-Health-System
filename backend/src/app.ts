import express, { Request, Response } from 'express';
import cors from "cors";
import dashboard from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import driverRoutes from "./routes/driver.routes";
import ambulanceRoutes from "./routes/ambulance.routes";
import policeRoutes from "./routes/police.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import path from "path";

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://medcab-cloud.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Medcab Backend API');
});

// ✅ Serve static files (make /public available)
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

app.use("/api/auth", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/dashboard", dashboard);
app.use("/api/driver", driverRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/police", policeRoutes);

app.use(errorMiddleware);

export default app;