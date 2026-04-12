'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '@/components/Reusable-Components';
import ROUTES from '@/constants/routes';

interface CompanyCardProps {
  id: string;
  name: string;
  logo: string;
}

export default function CompanyCard({ 
  id, 
  name, 
  logo, 
}: CompanyCardProps) {
  return (
    <Link href={`${ROUTES.COMPANIES.LIST}/${id}`}>
      <div className="auth-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full">
        {/* Company Logo */}
        <div className="w-20 h-20 mx-auto mb-4 relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={logo}
            alt={name}
            width={80}
            height={80}
            priority
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Company Name */}
        <Typography 
          variant="h3" 
          className="text-foreground text-center mb-3 group-hover:text-primary transition-colors"
        >
          {name}
        </Typography>
      </div>
    </Link>
  );
}
