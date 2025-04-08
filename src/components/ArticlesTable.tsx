
import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Eye, SortAsc, SortDesc } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArticleListItem } from '@/services/myArticlesService';

interface ArticlesTableProps {
  articles: ArticleListItem[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: string) => void;
  total?: number;
}

export const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  sortColumn,
  sortDirection,
  handleSort,
  total,
}) => {
  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="inline ml-1 h-4 w-4" /> : 
      <SortDesc className="inline ml-1 h-4 w-4" />;
  };

  return (
    <Table>
      <TableCaption>
        {total && total > 0 && `Showing ${articles.length} of ${total} articles`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="w-[300px] cursor-pointer"
            onClick={() => handleSort('title')}
          >
            Title {getSortIcon('title')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('category')}
          >
            Category {getSortIcon('category')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('status')}
          >
            Status {getSortIcon('status')}
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('updated_at')}
          >
            Last Updated {getSortIcon('updated_at')}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map(article => (
          <TableRow key={article.id}>
            <TableCell className="font-medium">{article.title}</TableCell>
            <TableCell>{article.category || '—'}</TableCell>
            <TableCell>
              <Badge variant={article.isPublished ? 'default' : 'outline'}>
                {article.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </TableCell>
            <TableCell>{new Date(article.updatedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/article/${article.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/article/edit/${article.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
