function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function id(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function recordDuplicate(errors: string[], seen: Set<string>, value: unknown, label: string) {
  const candidate = id(value);
  if (!candidate) return;
  if (seen.has(candidate)) errors.push(`duplicate ${label} ID ${candidate}`);
  else seen.add(candidate);
}

export function validatePresentationIr(value: unknown): string[] {
  if (!isRecord(value)) return ["presentation IR must be an object"];
  const errors: string[] = [];

  const revisionId = id(value.revisionId);
  const render = isRecord(value.render) ? value.render : {};
  const verification = isRecord(value.verification) ? value.verification : {};
  if (revisionId && render.sourceSemanticRevisionId !== revisionId) {
    errors.push("render source revision must match revisionId");
  }
  if (revisionId && verification.sourceSemanticRevisionId !== revisionId) {
    errors.push("verification source revision must match revisionId");
  }

  const theme = isRecord(value.theme) ? value.theme : {};
  const tokenIds = new Set<string>();
  for (const token of list(theme.tokens)) {
    if (!isRecord(token)) continue;
    recordDuplicate(errors, tokenIds, token.id, "theme token");
  }

  const assetIds = new Set<string>();
  for (const asset of list(value.assets)) {
    if (!isRecord(asset)) continue;
    recordDuplicate(errors, assetIds, asset.id, "asset");
  }

  const semantic = isRecord(value.semantic) ? value.semantic : {};
  const semanticSlideIds = new Set<string>();
  const semanticElementIds = new Set<string>();
  const semanticSlides = new Map<string, Map<string, Record<string, unknown>>>();

  for (const [slideIndex, slideValue] of list(semantic.slides).entries()) {
    if (!isRecord(slideValue)) continue;
    recordDuplicate(errors, semanticSlideIds, slideValue.id, "semantic slide");
    const slideId = id(slideValue.id);
    const elements = new Map<string, Record<string, unknown>>();

    for (const elementValue of list(slideValue.elements)) {
      if (!isRecord(elementValue)) continue;
      recordDuplicate(errors, semanticElementIds, elementValue.id, "semantic element");
      const elementId = id(elementValue.id);
      if (elementId && !elements.has(elementId)) elements.set(elementId, elementValue);

      const content = isRecord(elementValue.content) ? elementValue.content : {};
      const assetRef = content.type === "asset" ? id(content.assetId) : content.type === "chart" ? id(content.dataAssetId) : undefined;
      if (assetRef && !assetIds.has(assetRef)) {
        errors.push(`semantic element ${elementId ?? "unknown"}: unknown asset ${assetRef}`);
      }
    }

    const accessibility = isRecord(slideValue.accessibility) ? slideValue.accessibility : {};
    const readingOrder = list(accessibility.readingOrder).filter((item): item is string => typeof item === "string");
    const readingOrderIds = new Set<string>();
    for (const elementId of readingOrder) {
      if (readingOrderIds.has(elementId)) {
        errors.push(`semantic slide ${slideId ?? slideIndex}: reading order duplicates element ${elementId}`);
        continue;
      }
      readingOrderIds.add(elementId);
      const element = elements.get(elementId);
      if (!element) {
        errors.push(`semantic slide ${slideId ?? slideIndex}: reading order contains unknown element ${elementId}`);
        continue;
      }
      const elementAccessibility = isRecord(element.accessibility) ? element.accessibility : {};
      if (elementAccessibility.decorative === true) {
        errors.push(`semantic slide ${slideId ?? slideIndex}: reading order contains decorative element ${elementId}`);
      }
    }
    for (const [elementId, element] of elements) {
      const elementAccessibility = isRecord(element.accessibility) ? element.accessibility : {};
      if (elementAccessibility.decorative !== true && !readingOrderIds.has(elementId)) {
        errors.push(`semantic slide ${slideId ?? slideIndex}: reading order missing non-decorative element ${elementId}`);
      }
    }

    if (slideId && !semanticSlides.has(slideId)) semanticSlides.set(slideId, elements);
  }

  const renderSlideIds = new Set<string>();
  const renderElementIds = new Set<string>();
  for (const [slideIndex, slideValue] of list(render.slides).entries()) {
    if (!isRecord(slideValue)) continue;
    recordDuplicate(errors, renderSlideIds, slideValue.id, "render slide");
    const renderSlideId = id(slideValue.id) ?? String(slideIndex);
    const semanticSlideId = id(slideValue.semanticSlideId);
    const semanticElements = semanticSlideId ? semanticSlides.get(semanticSlideId) : undefined;
    if (semanticSlideId && !semanticElements) {
      errors.push(`render slide ${renderSlideId}: unknown semantic slide ${semanticSlideId}`);
    }

    const backgroundTokenId = id(slideValue.backgroundTokenId);
    if (backgroundTokenId && !tokenIds.has(backgroundTokenId)) {
      errors.push(`render slide ${renderSlideId}: unknown theme token ${backgroundTokenId}`);
    }

    for (const [elementIndex, elementValue] of list(slideValue.elements).entries()) {
      if (!isRecord(elementValue)) continue;
      recordDuplicate(errors, renderElementIds, elementValue.id, "render element");
      const renderElementId = id(elementValue.id) ?? `${renderSlideId}.${elementIndex}`;
      const semanticElementId = id(elementValue.semanticElementId);
      if (semanticElementId && semanticElements && !semanticElements.has(semanticElementId)) {
        errors.push(`render element ${renderElementId}: unknown semantic element ${semanticElementId}`);
      }

      for (const tokenRef of list(elementValue.styleTokenRefs)) {
        const tokenId = id(tokenRef);
        if (tokenId && !tokenIds.has(tokenId)) {
          errors.push(`render element ${renderElementId}: unknown theme token ${tokenId}`);
        }
      }

      const assetId = id(elementValue.assetId);
      if (assetId && !assetIds.has(assetId)) {
        errors.push(`render element ${renderElementId}: unknown asset ${assetId}`);
      }
    }
  }

  return errors;
}
