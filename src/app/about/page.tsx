
export default async function About() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <h2>About page</h2>
  );
}
