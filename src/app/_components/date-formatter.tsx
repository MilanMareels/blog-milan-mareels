import { parseISO, format } from "date-fns";
import { nlBE } from "date-fns/locale";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "d MMMM yyyy", { locale: nlBE })}</time>;
};

export default DateFormatter;
