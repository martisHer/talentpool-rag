import fs from "fs";

import { CVChunk } from "./types";

const vectorStore: CVChunk[] = [];

export type SearchFilters = {
  role?: string;
  location?: string;
};

export function addToVectorStore(
  chunks: CVChunk[]
) {
  vectorStore.push(...chunks);
}

export function getVectorStore() {
  return vectorStore;
}

export function clearVectorStore() {
  vectorStore.length = 0;
}

export function saveVectorStore(
  filePath: string
) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      vectorStore,
      null,
      2
    ),
    "utf-8"
  );
}

export function loadVectorStore(
  filePath: string
) {
  if (!fs.existsSync(filePath)) {
    clearVectorStore();
    return [];
  }

  const data = JSON.parse(
    fs.readFileSync(
      filePath,
      "utf-8"
    )
  ) as CVChunk[];

  clearVectorStore();

  vectorStore.push(...data);

  return data;
}

function cosineSimilarity(
  a: number[],
  b: number[]
) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB))
  );
}

export function searchVectorStore(
  queryEmbedding: number[],
  limit = 5,
  filters?: SearchFilters
) {
  return vectorStore
    .filter(
      chunk =>
        chunk.embedding !== undefined
    )
    .filter(chunk => {
      if (filters?.location) {
        const candidateLocation =
          chunk.location.toLowerCase();

        const requestedLocation =
          filters.location.toLowerCase();

        if (
          !candidateLocation.includes(
            requestedLocation
          )
        ) {
          return false;
        }
      }

      if (filters?.role) {
        const candidateRole =
          chunk.role.toLowerCase();

        const requestedRole =
          filters.role.toLowerCase();

        if (
          !candidateRole.includes(
            requestedRole
          )
        ) {
          return false;
        }
      }

      return true;
    })
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(
        queryEmbedding,
        chunk.embedding!
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, limit);
}

export function searchCandidates(
  queryEmbedding: number[],
  limit = 5,
  filters?: SearchFilters
) {
  const chunkResults =
    searchVectorStore(
      queryEmbedding,
      20,
      filters
    );

  const candidates = new Map<
    string,
    (typeof chunkResults)[number]
  >();

  for (const result of chunkResults) {
    const existing =
      candidates.get(
        result.candidateId
      );

    if (
      !existing ||
      result.score > existing.score
    ) {
      candidates.set(
        result.candidateId,
        result
      );
    }
  }

  return Array.from(
    candidates.values()
  )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, limit);
}

export function searchCandidatesByMetadata(
  limit = 5,
  filters?: SearchFilters
) {
  const candidates = new Map<
    string,
    CVChunk
  >();

  for (const chunk of vectorStore) {
    if (filters?.location) {
      const candidateLocation =
        chunk.location.toLowerCase();

      const requestedLocation =
        filters.location.toLowerCase();

      if (
        !candidateLocation.includes(
          requestedLocation
        )
      ) {
        continue;
      }
    }

    if (filters?.role) {
      const candidateRole =
        chunk.role.toLowerCase();

      const requestedRole =
        filters.role.toLowerCase();

      if (
        !candidateRole.includes(
          requestedRole
        )
      ) {
        continue;
      }
    }

    if (
      !candidates.has(
        chunk.candidateId
      )
    ) {
      candidates.set(
        chunk.candidateId,
        chunk
      );
    }
  }

  return Array.from(
    candidates.values()
  ).slice(0, limit);
}