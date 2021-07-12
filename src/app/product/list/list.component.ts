import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  products : Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated : boolean;
  userId;
  private productsSub : Subscription;
  private authStatusSub : Subscription;

  constructor(private authService: AuthService, private productsService: ProductService) { }

  ngOnInit() {
    this.isLoading = true;

    this.productsService.getProducts(this.productPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.productsSub = this.productsService.getProductUpdatedListner().subscribe((productData: {products: Product[], productCount: number}) => {
      console.log(productData);
      this.isLoading = false;
      this.products = productData.products;
      this.totalProducts = productData.productCount
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    })
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(() => {
      this.isLoading = false;
      this.productsService.getProducts(this.productPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    this.productPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.productsService.getProducts(this.productPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
