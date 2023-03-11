import { uuid } from "uuidv4";
import { client } from "@/utils/client";
import { postDetailQuery } from "./../../../utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (req.query.id) {
      const { id } = req.query;
      const query = postDetailQuery(id);

      const data = await client.fetch(query);

      res.status(200).json(data[0]);
    } else {
      res.status(500).json(" error: 'id' is undefined in 'query' ");
    }
  } else if (req.method === "PUT") {
    const { comment, userId } = req.body;
    const { id }: any = req.query;

    const data = await client
      .patch(id)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          comment,
          _key: uuid(),
          postedBy: { _type: "postedBy", _ref: userId },
        },
      ])
      .commit();
    res.status(200).json(data);
  }
}
