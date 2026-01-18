import { Component } from "@angular/core";

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    template: `

        <span class="loader"></span>
    `,
    styles: `

        .loader {
            width: 35px;
            height: 35px;
            border: 4px solid #FFF;
            border-bottom-color: grey;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation .5s linear infinite;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        } 
    `
})
export class LoadingSpinnerComponent{}