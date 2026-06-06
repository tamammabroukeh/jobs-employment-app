// import type { NextConfig } from 'next';
// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default withNextIntl(nextConfig);

import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    logging:{
        fetches:{
            fullUrl:true,
            hmrRefreshes:true
        },
        incomingRequests: false,
    },
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:"**", // Accept all HTTPS hostnames
            },
            {
                protocol:"http",
                hostname:"**", // Accept all HTTP hostnames (for development)
            }
        ]
    }
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);