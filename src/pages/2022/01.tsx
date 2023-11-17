import { api } from "~/utils/api";

export default function puzzle() {
  let inputFile = api.file.getInputFile.useQuery({ year: 2022, day: 1 });
  console.log(inputFile.data);
  return <div>hello</div>;
}
