import React from 'react'

const Swap = () => {
    return (
     <>
         <div className="swap-container">
         <a href="https://jup.ag/" target="_blank">
             <button class="bg-gray-900 text-gray-100 font-bold py-2 px-4 mx-2 rounded inline-flex items-center">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
</svg>{' '}
  <span>Swap</span>
</button>
</a>
<a  href="https://app.allbridge.io/bridge?amp_device_id=2syWbwqqgajM6Q6Yw0gADB&from=ETH&to=SOL&asset=ABR" target="_blank">
<button class="bg-gray-900  text-gray-100 font-bold py-2 px-4 mx-2 rounded inline-flex items-center">
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
</svg>{' '}
  <span>Bridge</span>
</button>
</a>
         </div>
     </>
    )
  }
  
  export default Swap;
  