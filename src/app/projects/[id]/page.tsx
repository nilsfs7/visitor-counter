import Link from 'next/link';
import { ChartArea } from '../../../components/chart/chart-area';
import { Moment } from 'moment';
import moment from 'moment';
import { Button } from '../../../components/ui/button';
import { ButtonCopyToClipboard } from '../../../components/button-to-clipboard';
import { getProject } from '../../../infra/clients/project.client';
import { getViews } from '../../../infra/clients/view.client';

export default async function Projects(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const project = await getProject(params.id);
  const views = await getViews(project.id || '');

  const data: {
    date: Moment;
    total: number;
  }[] = [];
  const unitOfTime: moment.unitOfTime.Base = 'day';
  let nextDateCreation: Moment | null = null;
  let totalCounter = 0;

  for (let i = 0; i < views.length; i++) {
    totalCounter += 1;

    const dateCreation = moment(views[i].created);

    // determine next day to compare with
    if (i + 1 < views.length) {
      nextDateCreation = moment(views[i + 1].created);
    } else {
      // for last dataset check against tomorrow year because no dataset can be created at this time
      nextDateCreation = moment().add(1, unitOfTime);
    }

    if (!dateCreation.isSame(nextDateCreation, unitOfTime)) {
      data.push({
        date: dateCreation.startOf(unitOfTime),
        total: totalCounter,
      });
    }
  }

  return (
    <div className="mx-2 overflow-y-auto">
      <div className="flex flex-col p-2 gap-2">
        <ChartArea
          data={data.map(ds => {
            return { date: ds.date.toString(), l1: ds.total };
          })}
          labels={['View count']}
          colors={['--chart-1']}
          title={project.name}
          description={`${moment(project.created).format('MMMM Do YYYY')}: ${project.description}`}
        />

        <div className="w-full flex justify-between gap-2">
          <Link href={'/projects'}>
            <Button>{`Back`}</Button>
          </Link>

          <div className="flex gap-2">
            <ButtonCopyToClipboard text={'Copy to clipboard'} content={`${process.env.NEXT_PUBLIC_SERVER_URL}?id=${project.id}`} />

            <a target="_blank" rel="noopener noreferrer" href={`${project.destination}`}>
              <Button>{'View page'}</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
