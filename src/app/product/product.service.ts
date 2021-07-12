import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './product.model';
import { map } from 'rxjs/operators';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products : Product[] = [];
  private productsUpdated = new Subject<{products: Product[], productCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  addProduct(name: string, description: string, price: string) {
    const productData = new FormData();
    productData.append('name', name);
    productData.append('description', description);
    productData.append('price', price);

    this.http.post<{message: string, product: Product}>(baseUrl + "/products/", productData)
    .subscribe((responseData) => {
      this.router.navigate(['/list']);
    });
  }

  updateProduct(id: string, name: string, description: string, price: number) {
    let productData: Product | FormData;

    productData = {id: id, name: name, description: description, price: price, creator: null};    

    this.http.put(baseUrl + "/products/" + id, productData)
    .subscribe((responseData) => {
      this.router.navigate(['/list']);
    });
  }

  deleteProduct(productId: string) {
    return this.http.delete(baseUrl + "/products/" + productId);
  }

  getProducts(productPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${productPerPage}&page=${currentPage}`;

    this.http.get<{message: string, products: any, maxProduct: number}>(baseUrl + "/products" + queryParams)
    .pipe(map((productData) => {
      console.log(productData);
      return {
        products: productData.products,
        productCount: productData.maxProduct
      }
    }))
    .subscribe((transformedPostData) => {
      console.log(transformedPostData);
      this.products = transformedPostData.products;
      this.productsUpdated.next({products: [...this.products], productCount: transformedPostData.productCount});
    });
  }

  getProductUpdatedListner() {
    return this.productsUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{id: string, name: string, description: string, price: number, creator: string}>(baseUrl + "/products/" + id);
  }

}
