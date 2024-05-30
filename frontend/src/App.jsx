import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Header, Footer } from "./components"
import { Home, Category, Cart, Product, Login } from "./pages"

import bannermens from './assets/bannermens.png'
import bannerwomens from './assets/bannerwomens.png'
import bannerkids from './assets/bannerkids.png'


export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <Header/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/mens" element={<Category category="men" banner={bannermens}/>}/>
              <Route path="/womens" element={<Category category="women" banner={bannerwomens}/>}/>
              <Route path="/kids" element={<Category category="kid" banner={bannerkids}/>} />
              <Route path="/product" element={<Product/>}>
                <Route path=":productId" element={<Product/>}/>
              </Route>
              <Route path="/cart-page" element={<Cart/>}/>
              <Route path="/login" element={<Login/>}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
    </main>
  )
}