'use client';

import { Pagination, ConfigProvider } from 'antd';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTheme } from '@/themes';
import { getAntdTheme } from '@/themes/antdThemeConfig';

interface ReusablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  className?: string;
}

export default function ReusablePagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  showSizeChanger = true,
  pageSizeOptions = ['10', '15', '20', '30', '50'],
  className = '',
}: ReusablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { themeMode } = useTheme();

  const handlePageChange = (page: number, newPageSize: number) => {
    // Create new URLSearchParams from current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update page and pageSize
    params.set('page', page.toString());
    params.set('per_page', newPageSize.toString());
    
    // Navigate to new URL with updated params
    router.push(`${pathname}?${params.toString()}`);
    
    // Call optional callback
    if (onPageChange) {
      onPageChange(page, newPageSize);
    }
  };

  return (
    <ConfigProvider theme={getAntdTheme(themeMode)}>
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={showSizeChanger}
          pageSizeOptions={pageSizeOptions}
          showTotal={(total, range) => (
            <span className="text-sm text-muted-foreground">
              {range[0]}-{range[1]} of {total} items
            </span>
          )}
          className="antd-pagination"
        />
      </div>
    </ConfigProvider>
  );
}
