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
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // Increase body size limit for image uploads
        },
    },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);