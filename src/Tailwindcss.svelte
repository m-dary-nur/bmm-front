<style global>   
   @import "tailwindcss/base";
   @import "tailwindcss/components";
   @import "tailwindcss/utilities";

   @import url("https://rsms.me/inter/inter.css");   
   
   html,
   body {
      margin: 0;
      padding: 0;
      scroll-behavior: smooth;   
      @apply bg-blue-100;
   }

   @media only screen and (max-width: 768px) {
      .scrolling-auto {
        overflow-y: auto;
        height: calc(100vh - 105px);
      }
   }
   
   @media only screen and (min-width: 769px) {
      .scrolling-auto {
        overflow-y: auto;
        height: calc(100vh - 127px);
      }
   }

   * {
      font-family: "Inter", sans-serif;
      font-size: 0.938rem;
      box-sizing: border-box;
      outline: none !important;  
   }

   .control {
      @apply flex flex-col-reverse py-2 transition-all duration-300 mx-2;
   }
   .control > label {
      @apply pl-2 leading-loose text-gray-500;
   }

   .select.focus + div + label,
   .control > input:focus + label, 
   .control > textarea:focus + label {
      @apply text-theme transition-all duration-300;
   }

   textarea {
      resize: none;
   }

   .switch-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      width: 40px;
      height: 20px;
      border-radius: 40px;
      position: relative;
      transition: background-color .15s;
   }
   
   .switch-label .switch-button {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      transition: 0.15s;
      background: #fff;
   }
   
   .switch:checked + .switch-label .switch-button {
      left: calc(100% - 2px);
      transform: translateX(-100%);
   }
   
   .switch-label:active .switch-button {
      width: 20px;
   }

   input::-moz-selection,
   input::-webkit-selection,
   input::-o-selection,
   input::selection {
      @apply bg-theme;
   }

   button:disabled {
      @apply opacity-50 cursor-not-allowed;
   }

   .shadow-bottom-bar {
      box-shadow: 0px -5px 7px -7px rgba(0, 0, 0, 0.3);
   }

   .shadow-th {
      box-shadow: 0 1px 0 #CBD5D0;
   }

   ::-webkit-scrollbar {
      width: 4px;
      -webkit-appearance: none;
   }

   ::-webkit-scrollbar:vertical {
      width: 4px;
   }

   ::-webkit-scrollbar:horizontal {
      height: 4px;
   }

   ::-webkit-scrollbar-track {
      @apply bg-transparent rounded-full;
   }

   ::-webkit-scrollbar-thumb {
      @apply bg-theme rounded-full;
   }

   .spin {
      animation: rotate infinite 2s linear;
   }

   @keyframes rotate {
      from {
         transform: rotate(0deg);
      }
      to {
         transform: rotate(360deg);
      }
   }

   .animate-slide-in-up {
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
      animation-duration: 0.4s;
   }

   @keyframes fadeInUp {
      0% {
         overflow-y: hidden;
         opacity: 0;
         transform: translateY(30px);
      }
      100% {
         overflow-y: unset;
         opacity: 1;
         transform: translateY(0);
      }
   }

   .animate-slide-in-down {
      -webkit-animation-name: fadeInDown;
      animation-name: fadeInDown;
      animation-duration: 0.4s;
   }


   @keyframes fadeInDown {
      0% {
         overflow-y: hidden;
         opacity: 0;
         transform: translateY(-30px);
      }
      100% {
         overflow-y: unset;
         opacity: 1;
         transform: translateY(0);
      }
   }

   .animate-slide-in-right {
      -webkit-animation-name: fadeInRight;
      animation-name: fadeInRight;
      animation-duration: 0.4s;
   }

   @keyframes fadeInRight {
      0% {
         opacity: 0;
         transform: translateX(-30px);
      }
      100% {
         opacity: 1;
         transform: translateX(0);
      }
   }

   .animate-slide-out-left {
      -webkit-animation-name: fadeOutLeft;
      animation-name: fadeOutLeft;
      animation-duration: 0.4s;
   }

   @keyframes fadeOutLeft {
      0% {
         opacity: 1;
         transform: translateX(0);
      }
      100% {
         opacity: 0;
         transform: translateX(-30px);
      }
   }

</style>