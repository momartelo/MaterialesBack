import { Router } from "express";


const visualRouter = Router();

visualRouter.get('/new', (req, res) => {
    res.sendFile(path.join(publicPath, 'newMaterial.html'));
});

visualRouter.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'materials.html'));
});

export { visualRouter }