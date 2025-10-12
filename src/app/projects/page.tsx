import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { getProjects } from '../../infra/clients/project.client';

export const dynamic = 'force-dynamic';

const trimString = (str: string, maxLength: number = 32) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
};

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[64px] row-start-2 items-center sm:items-start">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-[100px]">{`Project`}</TableHead>
              <TableHead className="font-bold w-[100px]">{`Description`}</TableHead>
              <TableHead className="font-bold">{`Created`}</TableHead>
              <TableHead className="font-bold">{`Statistics`}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(project => {
              const href = `/projects/${project.id}`;
              return (
                <TableRow key={`row-${project.id}`}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="font-medium">{trimString(project.description)}</TableCell>
                  <TableCell className="font-medium">{moment(project.created).format('MMM Do YYYY')}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={href}>
                      <Button>{`View`}</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="w-full flex justify-between gap-2">
          <Link href={'/'}>
            <Button>{`Back`}</Button>
          </Link>

          <Link href={'/projects/new'}>
            <Button>{`Create new project`}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
