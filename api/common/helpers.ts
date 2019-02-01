/**
 * This method is a stub. In a production application, there would need to be
 * some implementation to map an arbitrary vehicle ID to a manufacturer string.
 */
export const mapIdToManufacturer = (id: string): string | undefined => {
  const vehicles = {
    1234: 'gm',
    1235: 'gm',
  };
  return vehicles[id];
};
