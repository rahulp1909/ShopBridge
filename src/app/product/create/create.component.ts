import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  product:  Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  userIsAuthenticated: boolean;
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;
  private numberRegex: string;

  constructor(private authService: AuthService, private productService: ProductService,  public route: ActivatedRoute) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false;
      this.userIsAuthenticated = authStatus;
    });

    this.numberRegex = "^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$";

    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      price: new FormControl(null, {validators: [Validators.required, Validators.pattern(this.numberRegex)]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productService.getProduct(this.productId).subscribe(productData => {
          console.log(productData);
          this.isLoading = false;
          this.product = {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            creator: productData.creator
          };
          this.form.setValue({
            name: this.product.name, description: this.product.description, price: this.product.price
          });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode == 'create') {
      this.productService.addProduct(this.form.value.name, this.form.value.description, this.form.value.price);
    } else {
      this.productService.updateProduct(this.productId, this.form.value.name, this.form.value.description, this.form.value.price)
    }
    
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
