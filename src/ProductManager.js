import fs from 'fs'



export default class ProductManager {
    constructor() {
        this.products = [];
        this.path = './Productos.json';

    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(data);
                console.log(`List of products: \n`)
                return products;
            } else {
                return [];
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error("Invalid JSON in file");
            } else {
                throw error;
            }
        }
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            const error = new Error(`addProduct method error, all product fields are required. \n`);
            console.log(error)
            return;
        }
        const codeIndex = () => {
            return this.products.findIndex(product => product.code === code);
        }

        const codeValidation = () => {
            const index = codeIndex();
            return index !== -1 && this.products[index].code === code;
        }
        if (codeValidation()) {
            const error = new Error(`CodeValidation Error, duplicated product code found. \n`);
            console.log(error);
            return;
        }

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if (this.products.length === 0) {
            product.id = 1;
        }
        else {
            product.id = this.products[this.products.length - 1].id + 1
        }
        this.products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'));
        return this.products;
    }

    getProductById = async (productId) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const productsCopy = JSON.parse(data);
            const product = productsCopy.find((p) => p.id === parseInt(productId));
            return product;
        } catch (error) {
            throw error;
        }
    };


    updateProduct = async (id, update) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const productsCopy = JSON.parse(data);
            const index = productsCopy.findIndex((product) => product.id === id);
            if (index !== -1) {
                const updatedProduct = { ...productsCopy[index], ...update };
                productsCopy[index] = updatedProduct;
                await fs.promises.writeFile(this.path, JSON.stringify(productsCopy, null, '\t'));
                console.log(`Product with id ${id} updated successfully: \n, updatedProduct`);
                this.products = productsCopy; // update this.products
                return productsCopy;
            } else {
                const error = new Error('Product not found');
                console.log(error);
            }
        } catch (error) {
            throw error;
        }
    }

    deleteProduct = async (productID) => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const productsCopy = await JSON.parse(data);
            const index = productsCopy.findIndex((product) => product.id === productID);
            if (index !== -1) {
                const removed = productsCopy.splice(index, 1);
                console.log(`Removed product with id ${productID}: \n`, removed);
                await fs.promises.writeFile(this.path, JSON.stringify(productsCopy, null, '\t'));
                return productsCopy;
            } else {
                const error = new Error("Product not found");
                console.log(error);
            }
        } catch (error) {
            throw error;
        }
    }

};



const productManager = new ProductManager()
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc122", 25)
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 25)
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc125", 25)
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc125", 25)
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc126")
// await productManager.getProductById(2)
// await productManager.getProductById(8)
// await productManager.deleteProduct(2)
// productManager.getProductById(2)
// await productManager.updateProduct(1,{price: 300})
// console.log(await productManager.getProducts())
