export const projects = [
 ['Música','1510915361894-db8b60106cb1'],['Literatura','1495446815901-a7297e633e8d'],['Pintura','1513364776144-60967b0f800f'],['Teatro','1503095396549-807759245b35'],['Fotografia','1452587925148-ce544e77e70d'],['Poesia','1455390582262-044cdead277a'],['Artes Plásticas','1579783902614-a3fb3927b6a5'],['Dança','1508700115892-45ecd05ae2ad']
].map(([name,id])=>({name,coverImage:`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=80`}));
