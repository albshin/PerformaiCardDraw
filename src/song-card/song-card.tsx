import classNames from "classnames";
import { detectedLanguage } from "../utils";
import styles from "./song-card.css";
import { useMemo, useState } from "react";
import { IconMenu } from "./icon-menu";
import { CardLabel, LabelType } from "./card-label";
import { DrawnChart, EligibleChart } from "../models/Drawing";
import { ShockBadge } from "./shock-badge";
import { Popover2 } from "@blueprintjs/popover2";
import { SongSearch } from "../song-search";
import shallow from "zustand/shallow";
import { useDrawing } from "../drawing-context";
import { useConfigState } from "../config-state";

const isJapanese = detectedLanguage === "ja";

type Player = 1 | 2;

interface IconCallbacks {
  onVeto: (p: Player) => void;
  onProtect: (p: Player) => void;
  onReplace: (p: Player, chart: EligibleChart) => void;
  onRedraw: () => void;
  onReset: () => void;
}

interface Props {
  chart: DrawnChart | EligibleChart;
  vetoedBy?: Player;
  protectedBy?: Player;
  replacedBy?: Player;
  replacedWith?: EligibleChart;
  actionsEnabled?: boolean;
}

function useIconCallbacksForChart(chartId: number): IconCallbacks {
  const [handleBanPickPocket, redrawChart, resetChart] = useDrawing(
    (d) => [d.handleBanProtectReplace, d.redrawChart, d.resetChart],
    shallow
  );

  return useMemo(
    () => ({
      onVeto: handleBanPickPocket.bind(undefined, "ban", chartId),
      onProtect: handleBanPickPocket.bind(undefined, "protect", chartId),
      onReplace: handleBanPickPocket.bind(undefined, "pocket", chartId),
      onRedraw: redrawChart.bind(undefined, chartId),
      onReset: resetChart.bind(undefined, chartId),
    }),
    [handleBanPickPocket, redrawChart, resetChart, chartId]
  );
}

export function SongCard(props: Props) {
  const {
    chart,
    vetoedBy,
    protectedBy,
    replacedBy,
    replacedWith,
    actionsEnabled,
  } = props;
  const showVeto = useConfigState((s) => s.showVeto);

  const [showingIconMenu, setShowIconMenu] = useState(false);
  const showIcons = () => setShowIconMenu(true);
  const hideIcons = () => setShowIconMenu(false);

  const [pocketPickPendingForPlayer, setPocketPickPendingForPlayer] = useState<
    0 | 1 | 2
  >(0);

  const {
    name,
    nameTranslation,
    artist,
    artistTranslation,
    bpm,
    diffAbbr,
    diffColor,
    level,
    hasShock,
    jacket,
  } = replacedWith || chart;

  const hasLabel = !!(vetoedBy || protectedBy || replacedBy);

  const rootClassname = classNames(styles.chart, {
    [styles.vetoed]: vetoedBy,
    [styles.protected]: protectedBy,
    [styles.replaced]: replacedBy,
    [styles.clickable]: actionsEnabled && !hasLabel,
    [styles.hideVeto]: !showVeto,
  });

  let jacketBg = {};
  if (jacket) {
    jacketBg = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("jackets/${jacket}")`,
    };
  }

  let iconCallbacks = useIconCallbacksForChart((chart as DrawnChart).id);

  let menuContent: undefined | JSX.Element;
  if (actionsEnabled) {
    menuContent = (
      <IconMenu
        onProtect={iconCallbacks.onProtect}
        onStartPocketPick={setPocketPickPendingForPlayer}
        onVeto={iconCallbacks.onVeto}
        onRedraw={iconCallbacks.onRedraw}
      />
    );
  }

  return (
    <div
      className={rootClassname}
      onClick={
        showingIconMenu || hasLabel || pocketPickPendingForPlayer
          ? undefined
          : showIcons
      }
    >
      <SongSearch
        isOpen={!!pocketPickPendingForPlayer}
        onSongSelect={(song, chart) => {
          actionsEnabled &&
            chart &&
            iconCallbacks.onReplace(pocketPickPendingForPlayer as 1 | 2, chart);
          setPocketPickPendingForPlayer(0);
        }}
        onCancel={() => setPocketPickPendingForPlayer(0)}
      />
      {vetoedBy && (
        <CardLabel
          player={vetoedBy}
          type={LabelType.Ban}
          onRemove={iconCallbacks?.onReset}
        />
      )}
      {protectedBy && (
        <CardLabel
          player={protectedBy}
          type={LabelType.Protect}
          onRemove={iconCallbacks?.onReset}
        />
      )}
      {replacedBy && (
        <CardLabel
          player={replacedBy}
          type={LabelType.Pocket}
          onRemove={iconCallbacks?.onReset}
        />
      )}
      <div className={styles.cardCenter} style={jacketBg}>
        <div className={styles.name} title={nameTranslation}>
          {name}
        </div>
        {isJapanese ? null : (
          <div className={styles.nameTranslation}>{nameTranslation}</div>
        )}
        <div className={styles.artist} title={artistTranslation}>
          {artist}
        </div>
      </div>

      <Popover2
        content={menuContent}
        isOpen={showingIconMenu}
        onClose={hideIcons}
        placement="top"
        modifiers={{
          offset: { options: { offset: [0, 35] } },
        }}
      >
        <div
          className={styles.cardFooter}
          style={{ backgroundColor: diffColor }}
        >
          <div className={styles.bpm}>{bpm} BPM</div>
          {hasShock && <ShockBadge />}
          <div className={styles.difficulty}>
            {diffAbbr} {level}
          </div>
        </div>
      </Popover2>
    </div>
  );
}
