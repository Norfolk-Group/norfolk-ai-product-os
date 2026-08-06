function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateDesignContract(value: unknown): string[] {
  if (!isRecord(value)) return ["design contract must be an object"];
  const errors: string[] = [];

  if (Array.isArray(value.shadcnInputs)) {
    for (const [index, input] of value.shadcnInputs.entries()) {
      if (!isRecord(input)) continue;
      if (input.recordedHash !== input.resolvedHash) {
        errors.push(`shadcnInputs[${index}]: hash mismatch between recorded and resolved source`);
      }
    }
  }

  const references = new Map<string, string>();
  if (Array.isArray(value.references)) {
    for (const reference of value.references) {
      if (isRecord(reference) && typeof reference.id === "string" && typeof reference.state === "string") {
        references.set(reference.id, reference.state);
      }
    }
  }
  if (Array.isArray(value.rules)) {
    for (const [ruleIndex, rule] of value.rules.entries()) {
      if (!isRecord(rule) || !Array.isArray(rule.sources)) continue;
      for (const source of rule.sources) {
        if (!isRecord(source) || typeof source.referenceId !== "string") continue;
        if (references.get(source.referenceId) !== "accepted") {
          errors.push(`rules[${ruleIndex}]: source ${source.referenceId} is not an accepted reference`);
        }
      }
    }
  }

  const inheritance = isRecord(value.inheritance) ? value.inheritance : undefined;
  const preferences = inheritance && isRecord(inheritance.userPreferences) ? inheritance.userPreferences : undefined;
  if (preferences && Array.isArray(preferences.allowed) && isRecord(preferences.values)) {
    const allowed = new Set(preferences.allowed.filter((item): item is string => typeof item === "string"));
    for (const key of Object.keys(preferences.values)) {
      if (!allowed.has(key)) errors.push(`userPreferences.values.${key}: preference is not allowed by this contract`);
    }
  }

  return errors;
}

const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

export function validateBrandProfile(value: unknown): string[] {
  if (!isRecord(value)) return ["brand profile must be an object"];
  const errors: string[] = [];
  const modes = new Set(list(value.modes));
  if (!modes.has("norfolk-master") || !modes.has("client-master")) errors.push("brand profile must support Norfolk master and client master modes");
  if (value.incompleteClientBrand !== "derived-client-system") errors.push("incomplete client identity must become a derived client system");
  if (value.foundationProtected !== true) errors.push("brand layers cannot weaken the neutral product foundation");

  const norfolk = isRecord(value.norfolkMaster) ? value.norfolkMaster : {};
  if (norfolk.name !== "Norfolk AI") errors.push("canonical master brand name must be Norfolk AI");
  if (norfolk.visualAuthority !== "Claude Design") errors.push("official Norfolk visual assets remain under Claude Design authority");
  if (norfolk.interimVisuals !== "neutral-semantic-placeholders") errors.push("interim Norfolk visuals must remain neutral semantic placeholders");

  const endorsement = isRecord(value.endorsement) ? value.endorsement : {};
  if (endorsement.text !== "Powered by Norfolk AI" || endorsement.url !== "https://www.norfolk.ai") errors.push("Norfolk endorsement text and URL are canonical");
  if (endorsement.required !== true) errors.push("Norfolk endorsement is required");
  if (endorsement.removable !== false) errors.push("Norfolk endorsement cannot be removable");
  if (endorsement.newTab !== true) errors.push("Norfolk endorsement opens in a new tab");

  const identity = isRecord(value.productIdentity) ? value.productIdentity : {};
  if (identity.scope !== "product" || identity.globalAcrossInstances !== true || identity.configuredBy !== "super-admin") errors.push("product identity must be global per product and controlled by Super Admin");

  const appearance = isRecord(value.appearance) ? value.appearance : {};
  const variants = new Set(list(appearance.variants));
  if (!variants.has("light") || !variants.has("dark")) errors.push("light and dark modes are both first-class");
  if (appearance.firstVisit !== "system" || appearance.persistSelection !== true) errors.push("appearance must follow system first and persist user selection");
  return errors;
}

export function validateMediaAssetWorkflow(value: unknown): string[] {
  if (!isRecord(value)) return ["media asset workflow must be an object"];
  const errors: string[] = [];
  const libraries = isRecord(value.libraries) ? value.libraries : {};
  if (libraries.platformPrivate !== true || libraries.organizationIsolated !== true || libraries.crossOrganizationLeakage !== false) errors.push("asset libraries must be private and organization-isolated");

  const generation = isRecord(value.generation) ? value.generation : {};
  if (generation.originalPreserved !== true) errors.push("media generation must preserve the original");
  if (generation.candidateCount !== 3) errors.push("media generation must create three candidates");
  if (generation.regenerationAllowed !== true || generation.historyPreserved !== true) errors.push("media generation must support regeneration and history");

  const portraits = isRecord(value.portraits) ? value.portraits : {};
  if (portraits.modelTrainingAllowed !== false) errors.push("portrait images cannot be used for model training");
  if (portraits.explicitSelectionRequired !== true) errors.push("portrait activation requires explicit selection");
  if (portraits.identityFidelity !== true) errors.push("portrait processing must preserve identity");
  if (portraits.manualEditingAllowed !== false) errors.push("portrait composition is governed rather than manually edited");
  if (portraits.initialsFallback !== "first-last-or-first-two") errors.push("portrait workflow requires the canonical initials fallback");

  const propertyImages = isRecord(value.propertyImages) ? value.propertyImages : {};
  if (propertyImages.factualChangesAllowed !== false) errors.push("property processing cannot make factual changes");
  if (propertyImages.disclosure !== "metadata-and-report-not-render-overlay") errors.push("AI enhancement disclosure belongs in metadata and reports, not the clean render");

  const provider = isRecord(value.externalProvider) ? value.externalProvider : {};
  if (provider.noTraining !== true || provider.encryptedTransfer !== true || provider.verifiedDeletion !== true || provider.failClosed !== true) errors.push("external media processing requires no-training, encryption, deletion, and fail-closed guarantees");

  const sharing = isRecord(value.sharing) ? value.sharing : {};
  if (sharing.privateByDefault !== true || sharing.approval !== "super-admin") errors.push("private asset sharing requires Super Admin approval");
  const deletion = isRecord(value.deletion) ? value.deletion : {};
  if (deletion.recoverable !== true || deletion.referenceAware !== true || deletion.finalPurgeBy !== "super-admin") errors.push("asset deletion must be recoverable, reference-aware, and Super Admin controlled");
  return errors;
}
