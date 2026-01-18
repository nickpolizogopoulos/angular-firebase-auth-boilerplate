import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    
        <h1>Page not found</h1>
        <button routerLink="/">Go back</button>
    `
})
export class PageNotFound {}