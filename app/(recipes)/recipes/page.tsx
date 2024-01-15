export default function Recipes({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const { filter: filter } = searchParams as { [key: string]: string };
  return <div>{filter} Recipes</div>;
}
