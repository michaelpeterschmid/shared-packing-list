export const hasModifyRights = (listDoc, user) => {
  if (!listDoc || !listDoc.users || !user) return false;

  for (const listUser of listDoc.users) {
    if (
      listUser.userId === user.uid &&
      (listUser.accessRight === "m" || listUser.accessRight === "o")
    ) {
      return true;
    }
  }
  return false;
};
