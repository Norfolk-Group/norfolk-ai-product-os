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

function isGovernedAsset(value: Record<string, unknown>): boolean {
  const governance = isRecord(value.governance) ? value.governance : {};
  return typeof value.registryRef === "string"
    && value.registryRef.startsWith("norfolk-registry://")
    && typeof value.sha256 === "string"
    && /^[a-f0-9]{64}$/.test(value.sha256)
    && governance.status === "approved-norfolk-synthetic"
    && governance.owner === "Norfolk AI"
    && typeof governance.rightsReviewId === "string";
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
  const assets = new Map<string, Record<string, unknown>>();
  for (const asset of list(value.assets)) {
    if (!isRecord(asset)) continue;
    recordDuplicate(errors, assetIds, asset.id, "asset");
    const assetId = id(asset.id);
    if (assetId && !assets.has(assetId)) assets.set(assetId, asset);
  }

  const semantic = isRecord(value.semantic) ? value.semantic : {};
  const semanticSlideIds = new Set<string>();
  const semanticElementIds = new Set<string>();
  const semanticSlideOrders = new Set<number>();
  const semanticSlides = new Map<string, { slide: Record<string, unknown>; elements: Map<string, Record<string, unknown>> }>();

  for (const [slideIndex, slideValue] of list(semantic.slides).entries()) {
    if (!isRecord(slideValue)) continue;
    recordDuplicate(errors, semanticSlideIds, slideValue.id, "semantic slide");
    const slideId = id(slideValue.id);
    if (typeof slideValue.order === "number") {
      if (semanticSlideOrders.has(slideValue.order)) errors.push(`duplicate semantic slide order ${slideValue.order}`);
      else semanticSlideOrders.add(slideValue.order);
    }
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
      } else if (assetRef && !isGovernedAsset(assets.get(assetRef)!)) {
        errors.push(`semantic element ${elementId ?? "unknown"}: asset ${assetRef} is not governed`);
      } else if (assetRef && content.type === "chart" && assets.get(assetRef)?.kind !== "data") {
        errors.push(`semantic element ${elementId ?? "unknown"}: chart content requires data asset ${assetRef}`);
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

    if (slideId && !semanticSlides.has(slideId)) semanticSlides.set(slideId, { slide: slideValue, elements });
  }

  const renderSlideIds = new Set<string>();
  const renderElementIds = new Set<string>();
  const renderSlides = list(render.slides);
  const renderCoverage = new Map<string, number>();
  for (const [slideIndex, slideValue] of renderSlides.entries()) {
    if (!isRecord(slideValue)) continue;
    recordDuplicate(errors, renderSlideIds, slideValue.id, "render slide");
    const renderSlideId = id(slideValue.id) ?? String(slideIndex);
    const semanticSlideId = id(slideValue.semanticSlideId);
    const semanticSlide = semanticSlideId ? semanticSlides.get(semanticSlideId) : undefined;
    const semanticElements = semanticSlide?.elements;
    if (!semanticSlideId) {
      errors.push(`render slide ${renderSlideId}: missing semantic slide reference`);
    } else if (!semanticSlide) {
      errors.push(`render slide ${renderSlideId}: unknown semantic slide ${semanticSlideId}`);
    } else {
      renderCoverage.set(semanticSlideId, (renderCoverage.get(semanticSlideId) ?? 0) + 1);
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
      const semanticElement = semanticElementId ? semanticElements?.get(semanticElementId) : undefined;
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
      const asset = assetId ? assets.get(assetId) : undefined;
      if (assetId && !asset) {
        errors.push(`render element ${renderElementId}: unknown asset ${assetId}`);
      }
      const primitive = id(elementValue.primitive);
      const semanticContent = semanticElement && isRecord(semanticElement.content) ? semanticElement.content : {};
      if (semanticContent.type === "asset" && primitive !== "image") {
        errors.push(`render element ${renderElementId}: semantic asset content requires image primitive`);
      } else if (semanticContent.type === "chart" && primitive !== "chart") {
        errors.push(`render element ${renderElementId}: semantic chart content requires chart primitive`);
      }
      if (primitive === "image") {
        if (!assetId) errors.push(`render element ${renderElementId}: image primitive requires assetId`);
        else if (asset && !isGovernedAsset(asset)) errors.push(`render element ${renderElementId}: image primitive requires governed asset ${assetId}`);
        else if (asset && asset.kind !== "image" && asset.kind !== "svg") errors.push(`render element ${renderElementId}: image primitive requires image or svg asset ${assetId}`);
        if (semanticElement && semanticContent.type !== "asset") {
          errors.push(`render element ${renderElementId}: image primitive requires semantic asset content`);
        } else if (semanticContent.type === "asset" && assetId && semanticContent.assetId !== assetId) {
          errors.push(`render element ${renderElementId}: image asset ${assetId} must match semantic asset ${String(semanticContent.assetId)}`);
        }
      } else if (primitive === "chart") {
        if (!assetId) errors.push(`render element ${renderElementId}: chart primitive requires assetId`);
        else if (asset && !isGovernedAsset(asset)) errors.push(`render element ${renderElementId}: chart primitive requires governed asset ${assetId}`);
        else if (asset && asset.kind !== "data") errors.push(`render element ${renderElementId}: chart primitive requires data asset ${assetId}`);
        if (semanticElement && semanticContent.type !== "chart") {
          errors.push(`render element ${renderElementId}: chart primitive requires semantic chart content`);
        } else if (semanticContent.type === "chart" && assetId && semanticContent.dataAssetId !== assetId) {
          errors.push(`render element ${renderElementId}: chart asset ${assetId} must match semantic data asset ${String(semanticContent.dataAssetId)}`);
        }
      } else if (assetId) {
        errors.push(`render element ${renderElementId}: ${primitive ?? "unknown"} primitive cannot reference asset ${assetId}`);
      }
    }
  }

  for (const [semanticSlideId, semanticSlide] of semanticSlides) {
    const count = renderCoverage.get(semanticSlideId) ?? 0;
    if (count === 0) {
      errors.push(`semantic slide ${semanticSlideId} has no render slide`);
      continue;
    }
    const overflow = isRecord(semanticSlide.slide.overflow) ? semanticSlide.slide.overflow : {};
    if (count > 1 && overflow.strategy !== "split" && overflow.strategy !== "paginate") {
      errors.push(`semantic slide ${semanticSlideId}: multiple render slides require split or paginate overflow`);
    }
  }

  const output = isRecord(verification.output) ? verification.output : {};
  if (output.slideCount !== renderSlides.length) {
    errors.push(`verification slide count ${String(output.slideCount)} must equal rendered slide count ${renderSlides.length}`);
  }

  return errors;
}
